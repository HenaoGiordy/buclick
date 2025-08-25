package com.univalle.bubackend.repository;

import com.univalle.bubackend.models.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Integer> {
    Optional<Menu> findMenuById(Integer id);
    List<Menu> findTop2ByOrderByIdAsc();
}
