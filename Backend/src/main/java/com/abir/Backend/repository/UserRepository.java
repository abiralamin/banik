package com.abir.Backend.repository;

import com.abir.Backend.entity.Role;
import com.abir.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    List<User> findByRoleOrderByCreatedAtDesc(Role role);
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.active = true")
    List<User> findActiveVendors(@Param("role") Role role);
    Optional<User> findById(Long id);
}
