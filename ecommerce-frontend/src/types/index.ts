export interface Produto {
    id?: number;
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
}

export interface Cliente {
    id?: number;
    nome: string;
    email: string;
    cpf: string;
}

export interface ItemPedido {
    id?: number;
    produto: Produto;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export interface Pedido {
    id?: number;
    cliente: Cliente;
    itens: ItemPedido[];
    status: string;
    dataPedido: string;
    total: number;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
    size: number;
    first: boolean;
    last: boolean;
}