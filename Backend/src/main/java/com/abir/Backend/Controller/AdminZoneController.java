package com.abir.Backend.Controller;

import com.abir.Backend.dto.zone.ZoneRequest;
import com.abir.Backend.dto.zone.ZoneResponse;
import com.abir.Backend.service.ZoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/zones")
@RequiredArgsConstructor
public class AdminZoneController {

    private final ZoneService zoneService;

    @GetMapping
    public List<ZoneResponse> list(@RequestParam(required = false) String area) {
        return zoneService.listActive(area);
    }

    @PostMapping
    public ResponseEntity<ZoneResponse> create(@Valid @RequestBody ZoneRequest request) {
        return ResponseEntity.ok(zoneService.create(request));
    }

    @PutMapping("/{id}")
    public ZoneResponse update(@PathVariable Long id, @Valid @RequestBody ZoneRequest request) {
        return zoneService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> markUnavailable(@PathVariable Long id) {
        zoneService.markUnavailable(id);
        return ResponseEntity.noContent().build();
    }
}
