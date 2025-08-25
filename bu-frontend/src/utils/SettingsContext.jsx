import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settingId, setSettingId] = useState(null);
    const [settingData, setSettingData] = useState(null);

    return (
        <SettingsContext.Provider value={{ settingId, setSettingId, settingData, setSettingData }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    return useContext(SettingsContext);
};
