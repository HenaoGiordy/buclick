package com.univalle.bubackend.services.setting;

import com.univalle.bubackend.DTOs.setting.SettingRequest;
import com.univalle.bubackend.DTOs.setting.SettingResponse;

import java.util.List;

public interface ISettingService {
    SettingResponse createSetting(SettingRequest settingRequest);
    List<SettingResponse> getSetting();
    SettingResponse editSetting(SettingRequest settingRequest);
}
