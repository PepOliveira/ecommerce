package com.pedrooliveira.ecommerce.controller;


import com.pedrooliveira.ecommerce.model.Cliente;

import com.pedrooliveira.ecommerce.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public ResponseEntity<Cliente> salvar(@Valid @RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.salvar(cliente));
    }

    @GetMapping
    public ResponseEntity<Page<Cliente>> listarTodos(Pageable pageable) {
        return ResponseEntity.ok(clienteService.listarTodos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        clienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizar(@PathVariable Long id,@Valid @RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.atualizar(id, cliente));
    }

}
