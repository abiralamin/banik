package com.abir.Backend.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.abir.Backend.dto.zone.ZoneResponse;
import com.abir.Backend.service.ZoneService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/zones")
@RequiredArgsConstructor
public class PublicZoneController {

    private final ZoneService zoneService;

    @GetMapping
    public List<ZoneResponse> list(@RequestParam(required = false) String area) {
        return zoneService.listActive(area);
    }

    @GetMapping("/{id}")
    public ZoneResponse get(@PathVariable Long id) {
        return zoneService.get(id);
    }
}
