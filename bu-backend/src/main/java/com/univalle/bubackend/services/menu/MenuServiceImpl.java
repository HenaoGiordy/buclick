package com.univalle.bubackend.services.menu;

import com.univalle.bubackend.DTOs.menu.CreateMenuRequest;
import com.univalle.bubackend.exceptions.menu.MenuNotFound;
import com.univalle.bubackend.models.Menu;
import com.univalle.bubackend.repository.MenuRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MenuServiceImpl implements IMenuService{
    private MenuRepository menuRepository;

    @Override
    public CreateMenuRequest createMenu(CreateMenuRequest createMenuRequest) {
        Menu menu = new Menu(createMenuRequest);
        menuRepository.save(menu);
        return new CreateMenuRequest(menu.getId(), menu.getMainDish(), menu.getDrink(), menu.getDessert(), menu.getPrice(), menu.getNote(), menu.getLink());

    }

    @Override
    public List<CreateMenuRequest> getMenu() {
        List<Menu> menus = menuRepository.findTop2ByOrderByIdAsc();

        return menus.stream()
                .map(menu -> CreateMenuRequest.builder()
                        .id(menu.getId())
                        .mainDish(menu.getMainDish())
                        .drink(menu.getDrink())
                        .price(menu.getPrice())
                        .dessert(menu.getDessert())
                        .note(menu.getNote())
                        .link(menu.getLink())
                        .build())
                .collect(Collectors.toList());

    }

    @Override
    public CreateMenuRequest editMenu(CreateMenuRequest createMenuRequest) {
        Optional<Menu> menuRequestOpt = menuRepository.findMenuById(createMenuRequest.id());
        if (menuRequestOpt.isPresent()) {
            Menu menuExist = menuRequestOpt.get();
            menuExist.setMainDish(createMenuRequest.mainDish());
            menuExist.setDrink(createMenuRequest.drink());
            menuExist.setDessert(createMenuRequest.dessert());
            menuExist.setPrice(createMenuRequest.price());
            menuExist.setNote(createMenuRequest.note());
            menuExist.setLink(createMenuRequest.link());
            menuRepository.save(menuExist);
            return createMenuRequest;
        } else {
            throw new MenuNotFound("Menu no encontrado");
        }
    }


}
