package com.example.demo.repository.user;

import com.example.demo.entity.user.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;


/**
 * Repository for {@link Administrator} entities.
 * Provides CRUD operations and custom finder methods.
 */
@Repository
public interface AdministratorRepository extends JpaRepository<Administrator, Long> {

    /**
     * Finds an administrator by their unique username.
     *
     * @param username the username to search for
     * @return an {@link Optional} containing the found administrator, or empty if none exists
     */
    Optional<Administrator> findByUsername(String username);

    /**
     * Finds an administrator by their email address.
     *
     * @param email the email to search for
     * @return an {@link Optional} containing the found administrator, or empty if none exists
     */
    Optional<Administrator> findByEmail(String email);

    /**
     * Checks if a username already exists in the database.
     *
     * @param username the username to check
     * @return true if exists, false otherwise
     */
    boolean existsByUsername(String username);

    /**
     * Checks if an email already exists in the database.
     *
     * @param email the email to check
     * @return true if exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * (Optional) Delete an administrator by username.
     * Useful for administrative cleanup.
     */
    void deleteByUsername(String username);

    List <Administrator> findByRegionOfResponsibility(String region);
}