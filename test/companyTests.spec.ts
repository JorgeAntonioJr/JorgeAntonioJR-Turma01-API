import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Company API Tests', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api-desafio-qa.onrender.com/docs/';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Nova empresa', () => {
    it('Criar uma empresa válida', async () => {
      await p
      .spec()
      .post(`${baseUrl}/company`)
      .withJson({
        name: "Empresa Teste",
        cnpj: "12.345.678/0001-95",
        state: "São Paulo",
        city: "São Paulo",
        address: "Rua Deodoro da Fonseca",
        sector: "Facção"
      })
      .expectStatus(StatusCodes.OK)
    });
  })

  describe('Nova empresa', () => {
    it('Criar uma empresa sem nome', async () => {
      await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          cnpj: "12.345.678/0001-95",
          state: "São Paulo",
          city: "São Paulo",
          address: "Rua Deodoro da Fonseca",
          sector: "Facção"
        })
        .expectStatus(400);
    });
  })
  describe('CNPJ inválido', () => {
    it('Criar uma empresa com CNPJ inválido', async () => {
      await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          name: "Empresa Teste",
          cnpj: "CNPJ-Inválido",
          state: "São Paulo",
          city: "São Paulo",
          address: "Rua Deodoro da Fonseca",
          sector: "Facção"
        })
        .expectStatus(400);
    });  
  });
  describe('Empresa duplicada', () => {
    it('Criar uma empresa duplicada', async () => {
      await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          name: "Empresa Teste",
          cnpj: "12.345.678/0001-95",
          state: "São Paulo",
          city: "São Paulo",
          address: "Rua Deodoro da Fonseca",
          sector: "Facção"
        })
        .expectStatus(409);
    }); 
  });
  describe('Sem CNPJ', () => {
    it('Criar uma empresa sem CNPJ', async () => {
      await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          name: "Empresa Teste",
          state: "São Paulo",
          city: "São Paulo",
          address: "Rua Deodoro da Fonseca",
          sector: "Facção"
        })
        .expectStatus(400);
    }); 
  });
  describe('Campo extra', () => {
    it('Criar empresa com campos extras', async () => {
      await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          name: "Empresa Teste",
          cnpj: "12.345.678/0001-95",
          state: "São Paulo",
          city: "São Paulo",
          address: "Rua Deodoro da Fonseca",
          sector: "Facção",
          extraField: "Invalido"
        })
        .expectStatus(400);
    });    
  });
  describe('Listar empresas existentes', () => {
    it('Listar empresas existentes', async () => {
      await p
        .spec()
        .get(`${baseUrl}/company`)
        .expectStatus(200);
    });    
  });
  describe('Buscar empresa por ID válido', () => {
    it('Buscar empresa por ID válido', async () => {
      const { body } = await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          name: "Empresa Teste",
          cnpj: "12.345.678/0001-95",
          state: "São Paulo",
          city: "São Paulo",
          address: "Rua Deodoro da Fonseca",
          sector: "Facção"
        })
        .expectStatus(201);
    
      await p
        .spec()
        .get(`${baseUrl}/company/${body.id}`)
        .expectStatus(200);
    });    
  });
  describe('Deletar empresa existente', () => {
    it('Deletar empresa existente', async () => {
      const { body } = await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          name: "Empresa Teste",
          cnpj: "12.345.678/0001-95",
          state: "São Paulo",
          city: "São Paulo",
          address: "Rua Deodoro da Fonseca",
          sector: "Facção"
        })
        .expectStatus(201);
    
      await p
        .spec()
        .delete(`${baseUrl}/company/${body.id}`)
        .expectStatus(200);
    });    
  });
  describe('Deletar empresa inexistente', () => {
    it('Deletar empresa inexistente', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/company/999999`)
        .expectStatus(404);
    });    
  });
  describe('Atualizar dados da empresa existente', () => {
    it('Atualizar dados da empresa existente', async () => {
      const { body } = await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          name: "Empresa Teste",
          cnpj: "12.345.678/0001-95",
          state: "São Paulo",
          city: "São Paulo",
          address: "Rua Deodoro da Fonseca",
          sector: "Facção"
        })
        .expectStatus(201);
    
      await p
        .spec()
        .put(`${baseUrl}/company/${body.id}`)
        .withJson({
          name: "Empresa Atualizada",
          cnpj: "12.345.678/0001-95",
          state: "Rio de Janeiro",
          city: "Rio de Janeiro",
          address: "Rua Atualizada",
          sector: "Varejo"
        })
        .expectStatus(200);
    });  
  });
  describe('Atualizar CNPJ para um valor inválido', () => {
    it('Atualizar CNPJ para um valor inválido', async () => {
      const { body } = await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          name: "Empresa Teste",
          cnpj: "12.345.678/0001-95",
          state: "São Paulo",
          city: "São Paulo",
          address: "Rua Deodoro da Fonseca",
          sector: "Facção"
        })
        .expectStatus(201);
    
      await p
        .spec()
        .put(`${baseUrl}/company/${body.id}`)
        .withJson({
          name: "Empresa Atualizada",
          cnpj: "CNPJ-Inválido",
          state: "Rio de Janeiro",
          city: "Rio de Janeiro",
          address: "Rua Atualizada",
          sector: "Varejo"
        })
        .expectStatus(400);
    });    
  });
  describe('Criar empresa com payload vazio', () => {
    it('Criar empresa com payload vazio', async () => {
      await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({})
        .expectStatus(400);
    });
  });
  describe('Verificar limite de criação de empresas', () => {
    it('Verificar limite de criação de empresas', async () => {
      for (let i = 0; i < 100; i++) {
        await p
          .spec()
          .post(`${baseUrl}/company`)
          .withJson({
            name: `Empresa ${i}`,
            cnpj: `12.345.678/000${i}-95`,
            state: "São Paulo",
            city: "São Paulo",
            address: "Rua Deodoro da Fonseca",
            sector: "Facção"
          })
          .expectStatus(201);
      }
    });    
  });
  describe('Buscar empresa por nome específico', () => {
    it('Buscar empresa por nome específico', async () => {
      await p
        .spec()
        .get(`${baseUrl}/company?name=Empresa%20Teste`)
        .expectStatus(200)
        .expectJsonMatch({
          name: "Empresa Teste"
        });
    });    
  });
});



