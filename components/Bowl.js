import React, { useCallback, useEffect, useRef, useState } from "react";
import {Scene, PerspectiveCamera, AmbientLight, PointLight } from "three";
import { Renderer } from "expo-three";
delete global.WebGLRenderingContex;
delete global._WORKLET_RUNTIME;
import { GLView } from "expo-gl";
import OrbitControlsView from 'expo-three-orbit-controls';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Center, useBreakpointValue } from "native-base";
// Bowl must be mounted inside a React Navigation NavigationContainer.
import { useIsFocused } from "@react-navigation/native";

const BOWL_VIEW_KEY = 'bowl-view';
const ROTATION_STEP = 0.0025;   // radians per frame
const SAVE_EVERY_FRAMES = 15;   // periodic save cadence, in frames
const ORBIT_SAVE_DEBOUNCE_MS = 150;

// The focused Bowl instance owns persistence; instances kept mounted-but-hidden by the stack stay quiet.
let currentWriter = null;

function loadSavedView() {
    try {
        const raw = sessionStorage.getItem(BOWL_VIEW_KEY);
        if (!raw) return null;
        const v = JSON.parse(raw);
        const ok = a => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);
        if (typeof v.spin !== 'number' || !Number.isFinite(v.spin)) return null;
        if (!ok(v.position) || !ok(v.target)) return null;
        // camera sitting on the orbit target is a degenerate view — reject it
        const d = Math.hypot(
            v.position[0] - v.target[0],
            v.position[1] - v.target[1],
            v.position[2] - v.target[2]
        );
        return d > 0.001 ? v : null;
    } catch {
        return null; // no storage (native builds) or corrupt data — fall back to defaults
    }
}

function persistView(spin, position, target) {
    try {
        sessionStorage.setItem(BOWL_VIEW_KEY, JSON.stringify({ spin, position, target }));
    } catch {}
}

const Bowl = () => {    
    const [camera, setCamera] = useState();
    const animationFrame = useRef();
    const rendererRef = useRef();
    const modelRequest = useRef();
    const unmounted = useRef(false);
    const controlsRef = useRef();
    const modelRef = useRef();
    const orbitRef = useRef();
    const lastViewRef = useRef();
    const restoredView = useRef(false);
    const instanceId = useRef(Math.random().toString(36).slice(2));
    const isFocused = useIsFocused();
    const [savedView] = useState(loadSavedView);

    // restore the saved view once controls exist, then keep storage in sync while orbiting/zooming
    useEffect(() => {
        const controls = controlsRef.current?.getControls();
        if (!controls || !camera) return;
        // keep a live handle for the unmount flush — the child's ref is detached before this cleanup runs
        orbitRef.current = controls;

        if (savedView && !restoredView.current) {
            camera.position.set(...savedView.position);
            controls.target.set(...savedView.target);
            controls.update();
            restoredView.current = true;
        }

        let timer;
        const onChange = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                // never clobber a saved spin before this instance's model has loaded
                if (!modelRef.current || currentWriter !== instanceId.current) return;
                persistView(
                    modelRef.current.rotation.y,
                    [camera.position.x, camera.position.y, camera.position.z],
                    [controls.target.x, controls.target.y, controls.target.z]
                );
            }, ORBIT_SAVE_DEBOUNCE_MS);
        };
        controls.addEventListener('change', onChange);

        return () => {
            controls.removeEventListener('change', onChange);
            clearTimeout(timer);
            controls.dispose();
        };
    }, [camera]);

    useEffect(() => {
        return () => {
            unmounted.current = true;

            // persist the last periodic state; immediate handoff resumes from here
            const lastView = lastViewRef.current;
            if (currentWriter === instanceId.current && lastView) {
                persistView(
                    lastView.spin,
                    lastView.position,
                    lastView.target
                );
                currentWriter = null;
            }

            orbitRef.current = undefined;

            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }

            if (modelRequest.current?.abort) {
                modelRequest.current.abort();
            }

            rendererRef.current?.dispose();
        };
    }, []);

    useEffect(() => {
        if (isFocused) {
            currentWriter = instanceId.current;
        } else if (currentWriter === instanceId.current) {
            currentWriter = null;
        }

        return () => {
            if (currentWriter === instanceId.current) {
                currentWriter = null;
            }
        };
    }, [isFocused]);

    const onContextCreate = useCallback((gl) => {
        if (unmounted.current) return;

        const scene = new Scene();
        const camera = new PerspectiveCamera(
            50,
            gl.drawingBufferWidth/gl.drawingBufferHeight,
            .1,
            1000
        );
        const quickSetPosition = 7;
        camera.position.set(quickSetPosition, quickSetPosition, 8.5);
        if (!unmounted.current) setCamera(camera);

        gl.canvas.setSize = {width: gl.drawingBufferWidth, height: gl.drawingBufferHeight}

        const renderer = new Renderer({gl});
        rendererRef.current = renderer;
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
        
        let model;
        const loader = new GLTFLoader();
        modelRequest.current = loader.load(require('../assets/ramen.glb'), function (gltf) {
            if (unmounted.current) return;
            model = gltf.scene;
            model.castShadow = true;
            // Resume one save interval ahead of the stored phase: periodic saves are up
            // to SAVE_EVERY_FRAMES stale (navigation handoff, reloads), so advancing one
            // interval lands the bowl at/just past where it left off — never visibly behind.
            if (savedView) model.rotation.y = savedView.spin + ROTATION_STEP * SAVE_EVERY_FRAMES;
            modelRef.current = model;
            scene.add(model);
        }, undefined, function(error){
            console.log(error);
        });

        const ambientLight = new AmbientLight();
        scene.add(ambientLight);

        const pointLight = new PointLight();
        pointLight.position.set(20,2,10);
        scene.add(pointLight);

        let frame = 0;
        const render = () => {
            if (unmounted.current) return;
            animationFrame.current = requestAnimationFrame(render);
            if(model){
                model.position.y = -2;
                model.rotation.y += ROTATION_STEP;
                // persist a few times per second so reloads don't lose the phase either
                if (currentWriter === instanceId.current && ++frame % SAVE_EVERY_FRAMES === 0) {
                    const controls = controlsRef.current?.getControls();
                    if (controls) {
                        const lastView = {
                            spin: model.rotation.y,
                            position: [camera.position.x, camera.position.y, camera.position.z],
                            target: [controls.target.x, controls.target.y, controls.target.z]
                        };
                        lastViewRef.current = lastView;
                        persistView(
                            lastView.spin,
                            lastView.position,
                            lastView.target
                        );
                    }
                }
            }         
            renderer.render(scene, camera);
            gl.endFrameEXP();
        }

        render();
    }, [savedView]);

    const widthAndHeight = useBreakpointValue({
        base: 400,
        sm: 480,
        md: 640,
      });    

    return (
        <Center style={{ margin: "0 auto", width: "100%"}}>
            <OrbitControlsView ref={controlsRef} style={{ flex: 1 }} camera={camera}>
                <GLView onContextCreate={onContextCreate} style={{ width: widthAndHeight, height: widthAndHeight }}  />
            </OrbitControlsView>
        </Center>
    );
}

export default Bowl;
