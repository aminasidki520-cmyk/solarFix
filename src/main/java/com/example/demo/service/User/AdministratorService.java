package com.example.demo.service.User;

import com.example.demo.entity.user.Administrator;
import com.example.demo.repository.user.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdministratorService {

    @Autowired
    private AdministratorRepository administratorRepository;

    /**
     * Returns the list of administrators responsible for a given region.
     * If you only need the first one, you can call .get(0) on the result.
     * @param region the region name (e.g., "North", "South")
     * @return list of administrators (may be empty)
     */
    public List<Administrator> getAdministratorsByRegion(String region) {
        return administratorRepository.findByRegionOfResponsibility(region);
    }

    // You can add other service methods here (create, update, delete, etc.)
}