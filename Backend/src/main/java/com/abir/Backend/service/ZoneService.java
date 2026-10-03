package com.abir.Backend.service;

import com.abir.Backend.dto.zone.ZoneRequest;
import com.abir.Backend.dto.zone.ZoneResponse;
import com.abir.Backend.entity.VendingZone;
import com.abir.Backend.entity.ZoneStatus;
import com.abir.Backend.exception.ApiException;
import com.abir.Backend.repository.VendingZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ZoneService {

    private final VendingZoneRepository zoneRepository;

    public List<ZoneResponse> listActive(String area) {
        List<VendingZone> zones = (area == null || area.isBlank())
                ? zoneRepository.findByActiveTrue()
                : zoneRepository.findByAreaIgnoreCaseAndActiveTrue(area);
        return zones.stream().map(this::toResponse).toList();
    }

    public ZoneResponse get(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public ZoneResponse create(ZoneRequest request) {
        VendingZone zone = VendingZone.builder()
                .name(request.name())
                .area(request.area())
                .zoneType(request.zoneType())
                .description(request.description())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .dimensionsSqm(request.dimensionsSqm())
                .totalSpots(request.totalSpots())
                .occupiedSpots(0)
                .hasElectricity(request.hasElectricity())
                .hasWater(request.hasWater())
                .hasShade(request.hasShade())
                .nearbyLandmarks(request.nearbyLandmarks())
                .operatingHours(request.operatingHours())
                .rules(request.rules())
                .supervisorName(request.supervisorName())
                .supervisorContact(request.supervisorContact())
                .priceDaily(request.priceDaily())
                .priceWeekly(request.priceWeekly())
                .priceMonthly(request.priceMonthly())
                .priceAnnual(request.priceAnnual())
                .status(ZoneStatus.AVAILABLE)
                .active(true)
                .build();
        return toResponse(zoneRepository.save(zone));
    }

    @Transactional
    public ZoneResponse update(Long id, ZoneRequest request) {
        VendingZone zone = findOrThrow(id);
        zone.setName(request.name());
        zone.setArea(request.area());
        zone.setZoneType(request.zoneType());
        zone.setDescription(request.description());
        zone.setLatitude(request.latitude());
        zone.setLongitude(request.longitude());
        zone.setDimensionsSqm(request.dimensionsSqm());
        zone.setTotalSpots(request.totalSpots());
        zone.setHasElectricity(request.hasElectricity());
        zone.setHasWater(request.hasWater());
        zone.setHasShade(request.hasShade());
        zone.setNearbyLandmarks(request.nearbyLandmarks());
        zone.setOperatingHours(request.operatingHours());
        zone.setRules(request.rules());
        zone.setSupervisorName(request.supervisorName());
        zone.setSupervisorContact(request.supervisorContact());
        zone.setPriceDaily(request.priceDaily());
        zone.setPriceWeekly(request.priceWeekly());
        zone.setPriceMonthly(request.priceMonthly());
        zone.setPriceAnnual(request.priceAnnual());
        recomputeStatus(zone);
        return toResponse(zoneRepository.save(zone));
    }

    @Transactional
    public void markUnavailable(Long id) {
        VendingZone zone = findOrThrow(id);
        zone.setActive(false);
        zoneRepository.save(zone);
    }

    @Transactional
    public void incrementOccupancy(Long zoneId) {
        VendingZone zone = findOrThrow(zoneId);
        zone.setOccupiedSpots(zone.getOccupiedSpots() + 1);
        recomputeStatus(zone);
        zoneRepository.save(zone);
    }

    @Transactional
    public void decrementOccupancy(Long zoneId) {
        VendingZone zone = findOrThrow(zoneId);
        zone.setOccupiedSpots(Math.max(0, zone.getOccupiedSpots() - 1));
        recomputeStatus(zone);
        zoneRepository.save(zone);
    }

    private void recomputeStatus(VendingZone zone) {
        if (zone.getOccupiedSpots() >= zone.getTotalSpots()) {
            zone.setStatus(ZoneStatus.FULL);
        } else if (zone.getOccupiedSpots() > 0) {
            zone.setStatus(ZoneStatus.PARTIAL);
        } else {
            zone.setStatus(ZoneStatus.AVAILABLE);
        }
    }

    private VendingZone findOrThrow(Long id) {
        return zoneRepository.findById(id).orElseThrow(() -> ApiException.notFound("Zone not found"));
    }

    private ZoneResponse toResponse(VendingZone z) {
        return new ZoneResponse(z.getId(), z.getName(), z.getArea(), z.getZoneType(), z.getDescription(),
                z.getLatitude(), z.getLongitude(), z.getDimensionsSqm(), z.getTotalSpots(), z.getOccupiedSpots(),
                z.isHasElectricity(), z.isHasWater(), z.isHasShade(), z.getNearbyLandmarks(), z.getOperatingHours(),
                z.getRules(), z.getSupervisorName(), z.getSupervisorContact(), z.getPriceDaily(), z.getPriceWeekly(),
                z.getPriceMonthly(), z.getPriceAnnual(), z.getStatus().name());
    }
}
