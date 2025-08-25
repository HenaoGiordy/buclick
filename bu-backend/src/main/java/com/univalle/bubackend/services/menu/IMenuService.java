package com.univalle.bubackend.services.menu;

import com.univalle.bubackend.DTOs.menu.CreateMenuRequest;

import java.util.List;

public interface IMenuService {
    CreateMenuRequest createMenu(CreateMenuRequest createMenuRequest);
    List<CreateMenuRequest> getMenu();
    CreateMenuRequest editMenu(CreateMenuRequest createMenuRequest);
}
