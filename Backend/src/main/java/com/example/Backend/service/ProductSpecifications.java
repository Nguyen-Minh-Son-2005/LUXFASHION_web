package com.example.Backend.service; // Hoặc package com.example.Backend.repository

import com.example.Backend.dto.ProductFilterDTO;
import com.example.Backend.entity.*; // Import các Entity
import jakarta.persistence.criteria.*; // Import cho Specification
import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecifications {

    public static Specification<Product> filterBy(ProductFilterDTO filters) {

        Specification<Product> spec = Specification.where(null);

        if (filters.getName() != null && !filters.getName().isBlank()) {
            spec = spec.and(byName(filters.getName()));
        }

        if (filters.getSizeIds() != null && !filters.getSizeIds().isEmpty()) {
            spec = spec.and(bySizes(filters.getSizeIds()));
        }

        if (filters.getCategoryId() != null) {
            spec = spec.and(byCategory(filters.getCategoryId()));
        }
        if (filters.getSupplierIds() != null && !filters.getSupplierIds().isEmpty()) {
            spec = spec.and(bySuppliers(filters.getSupplierIds()));
        }
        if (filters.getMinPrice() != null || filters.getMaxPrice() != null) {
            spec = spec.and(byPriceRange(filters.getMinPrice(), filters.getMaxPrice()));
        }
        if (filters.getMinRating() != null) {
            spec = spec.and(byMinRating(filters.getMinRating()));
        }

        return spec;
    }

    private static Specification<Product> byName(String name) {
        return (root, query, cb) ->

        cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    private static Specification<Product> bySizes(List<Long> sizeIds) {
        return (root, query, cb) -> {
            Join<Product, ProductVariant> variantJoin = root.join("variants");

            Join<ProductVariant, Size> sizeJoin = variantJoin.join("size");

            return sizeJoin.get("id").in(sizeIds);
        };
    }

    private static Specification<Product> byCategory(Long categoryId) {
        return (root, query, cb) -> cb.equal(root.get("category_id").get("id"), categoryId);
    }

    private static Specification<Product> bySuppliers(List<Long> supplierIds) {
        return (root, query, cb) -> root.get("supplier_id").get("id").in(supplierIds);
    }

    private static Specification<Product> byMinRating(Double minRating) {

        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("averageRating"), minRating);
    }

    private static Specification<Product> byPriceRange(Double minPrice, Double maxPrice) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}