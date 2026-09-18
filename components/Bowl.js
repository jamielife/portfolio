import React, { useCallback, useEffect, useRef, useState } from "react";
import {Scene, PerspectiveCamera, AmbientLight, PointLight } from "three";
import { Renderer } from "expo-three";
delete global.WebGLRenderingContex;
delete global._WORKLET_RUNTIME;
import { GLView } from "expo-gl";
import OrbitControlsView from 'expo-three-orbit-controls';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Center, useBreakpointValue } from "native-base";

const Bowl = () => {    
    const [camera, setCamera] = useState();
    const animationFrame = useRef();
    const rendererRef = useRef();
    const modelRequest = useRef();
    const unmounted = useRef(false);
  
    useEffect(() => {
      return () => {
        unmounted.current = true;

        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }

        if (modelRequest.current?.abort) {
          modelRequest.current.abort();
        }

        rendererRef.current?.dispose();
      };
    }, []);
  
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
        
        var model;
        const loader = new GLTFLoader();
        modelRequest.current = loader.load(require('../assets/ramen.glb'), function (gltf) {
            if (unmounted.current) return;
            model = gltf.scene;
            model.castShadow = true;
            scene.add (model);
        }, undefined, function(error){
            console.log(error);
        });

        const ambientLight = new AmbientLight();
        scene.add(ambientLight);

        const pointLight = new PointLight();
        pointLight.position.set(20,2,10);
        scene.add(pointLight);

        const render = () => {
            if (unmounted.current) return;
            animationFrame.current = requestAnimationFrame(render);
            if(model){
                model.position.y = -2;
                model.rotation.y += 0.0025;
                //zoom in? z+= 1?
            }         
            renderer.render(scene, camera);
            gl.endFrameEXP();
        }

        render();
    }, []);

    const widthAndHeight = useBreakpointValue({
        base: 400,
        sm: 480,
        md: 640,
      });    

    return (
        <Center style={{ margin: "0 auto", width: "100%"}}>
            <OrbitControlsView style={{ flex: 1 }} camera={camera}>
                <GLView onContextCreate={onContextCreate} style={{ width: widthAndHeight, height: widthAndHeight }}  />
            </OrbitControlsView>    
        </Center>
    );
}

export default Bowl;
