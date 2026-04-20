package com.pedrooliveira.ecommerce.repository;

import com.pedrooliveira.ecommerce.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Page<Produto> findByNomeContainingIgnoreCase(String nome, Pageable pageable);
    Page<Produto> findByPrecoBetween(Double precoMin, Double precoMax, Pageable pageable);

    Long countByEstoqueLessThan(int estoque);
}
