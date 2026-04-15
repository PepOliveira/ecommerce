package com.pedrooliveira.ecommerce.controller;

import com.pedrooliveira.ecommerce.model.Produto;
import com.pedrooliveira.ecommerce.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<Produto> salvar(@Valid @RequestBody Produto produto) {
        return ResponseEntity.ok(produtoService.salvar(produto));
    }


    @GetMapping
    public ResponseEntity<Page<Produto>> listarTodos(Pageable pageable) {
        return ResponseEntity.ok(produtoService.listarTodos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @Valid @RequestBody Produto produto) {
        return ResponseEntity.ok(produtoService.atualizar(id, produto));
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<Produto>> buscarPorNome(
            @RequestParam String nome,
            Pageable pageable) {
        return ResponseEntity.ok(produtoService.buscarPorNome(nome, pageable));
    }

    @GetMapping("/preco")
    public ResponseEntity<Page<Produto>> buscarPorPreco(
            @RequestParam Double precoMin,
            @RequestParam Double precoMax,
            Pageable pageable) {
        return ResponseEntity.ok(produtoService.buscarPorPreco(precoMin, precoMax, pageable));
    }

}