import React, { useContext, useState, useEffect } from 'react';
import { en, ja } from '../localizations'
import * as Localization from 'expo-localization';
import { I18n } from "i18n-js";

const LangContext = React.createContext();
const LangUpdateContext = React.createContext();
const i18nContext = React.createContext();

export function useLang(){
    return useContext(LangContext);
}

export function useLangUpdate(){
    return useContext(LangUpdateContext);
}

export function useI18n(){
    return useContext(i18nContext);
}

export function LangProvider({ children }){
    //set to default browser/os language
    function setInitialLanguage(){    
        //check for cookie
        if(localStorage.getItem('locale') !== null) { 
            //console.log('used case 1');
            return localStorage.getItem('locale');
        } else if(Localization.locale !== null){
            //console.log('used case 2');
            return Localization.locale;
        } else {
            //console.log('used case 3');
            return "en";
        }
    }

    function getRemoteJSON() {
        const getJson = fetch('https://jamietaylor.me/json/localization.json', {        
            method: 'GET',
        })
        .then((response) => response.json())
        .then((responseData) => {
                    setLocalizationData(responseData);
                    //console.log(responseData);
                    return responseData;
        }).catch((error) => {
            console.log(error);
        });
    }    
    useEffect(() => {
        getRemoteJSON();
    }, []);    

    // use either preference setting or browser default language
    const initLocale = setInitialLanguage();
    const [locale, setLocale] = useState(initLocale);
    localStorage.setItem('locale', initLocale);

    //init i18n for translation using local json
    const i18n = new I18n();
    i18n.enableFallback = true;
    i18n.locale = locale;

    //Set with local data, then try to update with remote 
    const [localizationData, setLocalizationData] = useState(null);  
    i18n.translations = { en, ja };
    //update with remote data if available
    if(localizationData !== null){
        const en = localizationData.en;
        const ja = localizationData.ja;
        i18n.translations = { en, ja };
    } 
    
    function toggleLang(newLang){
        setLocale(newLang);
        localStorage.setItem('locale', newLang);
    }

    return(
        <LangContext.Provider value={locale}>
            <LangUpdateContext.Provider value={toggleLang}>
                <i18nContext.Provider value={i18n}>
                    {children}
                </i18nContext.Provider>
            </LangUpdateContext.Provider>
        </LangContext.Provider>
    )

}