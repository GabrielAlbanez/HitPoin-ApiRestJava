
# HitPointController - Guia de Referência

O arquivo `HitPointController.java` é um componente central da aplicação, responsável por gerenciar as operações relacionadas aos registros de ponto dos usuários. Este controlador define diversas rotas que permitem a interação com o sistema de ponto eletrônico, facilitando operações como registro de ponto, consulta de registros e obtenção de informações específicas.

## Funcionalidade

O `HitPointController` atua como uma interface entre o cliente e a lógica de negócios relacionada aos registros de ponto. Ele processa as solicitações HTTP recebidas, delega o processamento adequado aos serviços correspondentes e retorna as respostas apropriadas. As principais responsabilidades incluem:

- **Registro de Ponto**: Permite que os usuários registrem seus horários de entrada, pausa, retorno e saída.
- **Consulta de Registros**: Fornece endpoints para recuperar registros de ponto com base em diferentes critérios, como usuário, data ou tipo de ponto.
- **Gestão de Registros**: Oferece funcionalidades para atualizar ou excluir registros de ponto existentes.

## Rotas Disponíveis

A seguir, uma lista detalhada das rotas definidas no `HitPointController`, incluindo o método HTTP, o endpoint e uma breve descrição de cada um:

| Método HTTP | Endpoint                                      | Descrição                                                                                 |
|-------------|-----------------------------------------------|-------------------------------------------------------------------------------------------|
| `POST`      | `/usuarios/HitPoint`                          | Registra um novo ponto para o usuário autenticado.                                        |
| `GET`       | `/usuarios/HitPoint`                          | Recupera todos os pontos do usuário autenticado.                                          |
| `GET`       | `/usuarios/HitPoint/{id}`                     | Recupera um ponto específico pelo seu ID.                                                 |
| `PUT`       | `/usuarios/HitPoint/{id}`                     | Atualiza as informações de um ponto existente.                                            |
| `DELETE`    | `/usuarios/HitPoint/{id}`                     | Remove um ponto específico pelo seu ID.                                                   |
| `GET`       | `/usuarios/HitPoint/data/{data}`              | Recupera todos os pontos registrados em uma data específica.                              |
| `GET`       | `/usuarios/HitPoint/tipo/{tipo}`              | Recupera todos os pontos de um determinado tipo (entrada, pausa, retorno, saída).         |
| `GET`       | `/usuarios/HitPoint/usuario/{userId}`         | Recupera todos os pontos de um usuário específico pelo ID do usuário.                     |
| `GET`       | `/usuarios/HitPoint/usuario/{userId}/data/{data}` | Recupera todos os pontos de um usuário específico em uma data específica.               |

## Observações

- **Autenticação**: A maioria das rotas requer autenticação e validação de permissões.
- **Validação de Dados**: Certifique-se de que os dados enviados no corpo da requisição estejam no formato esperado para evitar erros.
- **Status de Resposta**: As rotas retornam códigos de status HTTP apropriados, como `200 OK`, `201 Created`, `400 Bad Request`, e `404 Not Found`.

---

## Exemplos de Uso

### Registro de Ponto

**Requisição**:
```http
POST /usuarios/HitPoint
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

**Body**:
```json
{
  "tipoPonto": "entrada"
}
```

**Resposta**:
```json
{
  "id": "1",
  "tipoPonto": "entrada",
  "hora": "08:00:00",
  "data": "2024-11-26"
}
```

---

### Recuperar Pontos por Data

**Requisição**:
```http
GET /usuarios/HitPoint/data/2024-11-26
Authorization: Bearer <TOKEN>
```

**Resposta**:
```json
[
  {
    "id": "1",
    "tipoPonto": "entrada",
    "hora": "08:00:00",
    "data": "2024-11-26"
  },
  {
    "id": "2",
    "tipoPonto": "saída",
    "hora": "17:00:00",
    "data": "2024-11-26"
  }
]
```

---

### Atualizar um Ponto

**Requisição**:
```http
PUT /usuarios/HitPoint/1
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

**Body**:
```json
{
  "tipoPonto": "entrada",
  "hora": "09:00:00"
}
```

**Resposta**:
```json
{
  "id": "1",
  "tipoPonto": "entrada",
  "hora": "09:00:00",
  "data": "2024-11-26"
}
```
