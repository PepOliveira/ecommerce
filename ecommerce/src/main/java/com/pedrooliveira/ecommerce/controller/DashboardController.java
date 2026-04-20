package com.pedrooliveira.ecommerce.controller;

import com.pedrooliveira.ecommerce.model.StatusPedido;
import com.pedrooliveira.ecommerce.repository.ClienteRepository;
import com.pedrooliveira.ecommerce.repository.PedidoRepository;
import com.pedrooliveira.ecommerce.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @GetMapping("/metricas")
    public ResponseEntity<Map<String, Object>> getMetricas() {
        Map<String, Object> metricas = new HashMap<>();


        metricas.put("totalProdutos", produtoRepository.count());
        metricas.put("totalClientes", clienteRepository.count());
        metricas.put("totalPedidos", pedidoRepository.count());


        Map<String, Long> pedidosPorStatus = new HashMap<>();
        for (StatusPedido status : StatusPedido.values()) {
            pedidosPorStatus.put(status.name(), pedidoRepository.countByStatus(status));
        }
        metricas.put("pedidosPorStatus", pedidosPorStatus);


        Double faturamento = pedidoRepository.calcularFaturamento();
        metricas.put("faturamentoTotal", faturamento != null ? faturamento : 0.0);


        metricas.put("produtosEstoqueBaixo", produtoRepository.countByEstoqueLessThan(10));

        return ResponseEntity.ok(metricas);
    }
}