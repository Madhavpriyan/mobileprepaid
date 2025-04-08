package com.prepaidrecharge.repository;

import com.prepaidrecharge.model.Role;
import com.prepaidrecharge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
  
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndPasswordAndRole_RoleName(String username, String password, Role.RoleName roleName);

    @Query("SELECT u FROM User u JOIN FETCH u.role WHERE u.username = :username")
    Optional<User> findByUsernameWithRole(@Param("username") String username);

    @Query("SELECT u FROM User u JOIN FETCH u.role WHERE u.mobileNo = :mobileNo")
    Optional<User> findByMobileNo(@Param("mobileNo") String mobileNo);
    // Count users by status
    @Query("SELECT u.status, COUNT(u) FROM User u GROUP BY u.status")
    List<Object[]> countUsersByStatus();
    boolean existsByMobileNo(String mobileNo);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status AND u.role.roleName = :roleName")
    long countByStatusAndRole_RoleName(@Param("status") String status, @Param("roleName") Role.RoleName roleName);
    
    @Query("SELECT u FROM User u JOIN FETCH u.role r WHERE r.roleName <> 'ADMIN'")
    List<User> findAllUsersExcludingAdmins();
}