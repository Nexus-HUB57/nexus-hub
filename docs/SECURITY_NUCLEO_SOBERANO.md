# Segurança do Núcleo Soberano - Fundo Nexus

Este documento descreve a arquitetura de segurança para a gestão de chaves privadas e ativos do Fundo Nexus.

## Arquitetura de Criptografia

Todas as chaves privadas integradas ao ecossistema são protegidas por uma camada de criptografia **AES-256-CBC**. 

### Parâmetros de Segurança:
- **Algoritmo**: AES-256-CBC
- **Derivação de Chave**: PBKDF2
- **Passphrase**: Armazenada como GitHub Secret (`NEXUS_VAULT_PASSPHRASE`)
- **Salt**: Armazenado como GitHub Secret (`NEXUS_VAULT_SALT`)

## Gestão de Secrets (GitHub)

Para manter a integridade do Núcleo Soberano em ambientes de CI/CD e produção, os seguintes Secrets devem ser configurados no repositório:

1. `NEXUS_VAULT_PASSPHRASE`: A frase secreta mestre para descriptografar o cofre.
2. `NEXUS_VAULT_SALT`: O salt utilizado na derivação da chave AES.

## Estrutura do Cofre

O arquivo `src/services/orchestration/sovereign-vault.json` contém os endereços públicos e os respectivos WIFs criptografados. 

> **IMPORTANTE**: Nunca faça commit de chaves privadas em texto claro. O script `scripts/integrate_nexus_vault.ts` deve ser utilizado para processar novas entradas, garantindo que elas sejam criptografadas antes de serem persistidas.

## Auditoria

O `FundoNexusCore` realiza auditoria automática de todas as tentativas de acesso ao cofre soberano, registrando eventos de ativação e falhas de carregamento.
