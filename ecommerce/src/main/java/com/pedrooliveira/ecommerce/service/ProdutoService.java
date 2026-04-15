package com.pedrooliveira.ecommerce.service;

import com.pedrooliveira.ecommerce.exception.ResourceNotFoundException;
import com.pedrooliveira.ecommerce.model.Produto;
import com.pedrooliveira.ecommerce.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com id: " + id));


    }

    public void deletar(Long id) {
        produtoRepository.deleteById(id);
    }

    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produto = buscarPorId(id);
        produto.setNome(produtoAtualizado.getNome());
        produto.setDescricao(produtoAtualizado.getDescricao());
        produto.setPreco(produtoAtualizado.getPreco());
        produto.setEstoque(produtoAtualizado.getEstoque());
        return produtoRepository.save(produto);
    }

    public Page<Produto> listarTodos(Pageable pageable) {
        return produtoRepository.findAll(pageable);
    }

    public Page<Produto> buscarPorNome(String nome, Pageable pageable) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome, pageable);
    }

    public Page<Produto> buscarPorPreco(Double precoMin, Double precoMax, Pageable pageable) {
        return produtoRepository.findByPrecoBetween(precoMin, precoMax, pageable);
    }

}