package com.pedrooliveira.ecommerce.controller;


import com.pedrooliveira.ecommerce.model.Pedido;
import com.pedrooliveira.ecommerce.model.StatusPedido;
import com.pedrooliveira.ecommerce.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<Pedido> salvar(@RequestBody Pedido pedido) {
        return ResponseEntity.ok(pedidoService.salvar(pedido));
    }

    @GetMapping
    public ResponseEntity<Page<Pedido>> listarTodos(Pageable pageable) {
        return ResponseEntity.ok(pedidoService.listarTodos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pedidoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Pedido> atualizarStatus(@PathVariable Long id, @RequestBody StatusPedido status) {
        return ResponseEntity.ok(pedidoService.atualizarStatus(id, status));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<Pedido>> buscarPorStatus(
            @PathVariable StatusPedido status,
            Pageable pageable) {
        return ResponseEntity.ok(pedidoService.buscarPorStatus(status, pageable));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<Page<Pedido>> buscarPorCliente(
            @PathVariable Long clienteId,
            Pageable pageable) {
        return ResponseEntity.ok(pedidoService.buscarPorCliente(clienteId, pageable));
    }

}