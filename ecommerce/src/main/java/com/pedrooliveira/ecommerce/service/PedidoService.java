package com.pedrooliveira.ecommerce.service;

import com.pedrooliveira.ecommerce.exception.EstoqueInsuficienteException;
import com.pedrooliveira.ecommerce.model.Cliente;
import com.pedrooliveira.ecommerce.model.Produto;
import com.pedrooliveira.ecommerce.repository.ClienteRepository;
import com.pedrooliveira.ecommerce.repository.ProdutoRepository;

import com.pedrooliveira.ecommerce.exception.ResourceNotFoundException;
import com.pedrooliveira.ecommerce.model.Pedido;
import com.pedrooliveira.ecommerce.model.StatusPedido;
import com.pedrooliveira.ecommerce.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProdutoRepository produtoRepository;
    public Pedido salvar(Pedido pedido) {
        // busca o cliente completo no banco
        Cliente cliente = clienteRepository.findById(pedido.getCliente().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        pedido.setCliente(cliente);

        // busca cada produto, verifica estoque e atualiza
        pedido.getItens().forEach(item -> {
            Produto produto = produtoRepository.findById(item.getProduto().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

            // verifica se tem estoque suficiente
            if (produto.getEstoque() < item.getQuantidade()) {
                throw new EstoqueInsuficienteException("Estoque insuficiente para o produto: "
                        + produto.getNome()
                        + ". Disponível: " + produto.getEstoque()
                        + ", Solicitado: " + item.getQuantidade());
            }

            // atualiza o estoque
            produto.setEstoque(produto.getEstoque() - item.getQuantidade());
            produtoRepository.save(produto);

            item.setProduto(produto);
            item.setPedido(pedido);
        });

        return pedidoRepository.save(pedido);
    }

    public Page<Pedido> listarTodos(Pageable pageable) {
        return pedidoRepository.findAll(pageable);
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com id: " + id));
    }

    public void deletar(Long id) {
        pedidoRepository.deleteById(id);
    }

    public Pedido atualizarStatus(Long id, StatusPedido statusPedido) {
        Pedido pedido = buscarPorId(id);
        pedido.setStatus(statusPedido);
        return pedidoRepository.save(pedido);
    }

    public Page<Pedido> buscarPorStatus(StatusPedido status, Pageable pageable) {
        return pedidoRepository.findByStatus(status, pageable);
    }

    public Page<Pedido> buscarPorCliente(Long clienteId, Pageable pageable) {
        return pedidoRepository.findByClienteId(clienteId, pageable);
    }

}
