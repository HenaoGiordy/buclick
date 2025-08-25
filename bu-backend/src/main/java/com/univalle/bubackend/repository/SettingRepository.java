package com.univalle.bubackend.repository;

import com.univalle.bubackend.models.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Integer> {
    Optional<Setting> findTopByOrderByIdAsc();
    Optional<Setting> findSettingById(Integer id);
}
