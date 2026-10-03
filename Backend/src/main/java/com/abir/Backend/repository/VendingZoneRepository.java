package com.abir.Backend.repository;

import com.abir.Backend.entity.VendingZone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendingZoneRepository extends JpaRepository<VendingZone, Long> {
    List<VendingZone> findByActiveTrue();
    List<VendingZone> findByAreaIgnoreCaseAndActiveTrue(String area);
}
