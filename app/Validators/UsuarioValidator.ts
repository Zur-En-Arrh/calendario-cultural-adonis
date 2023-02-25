import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsuarioValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    nome: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(1), rules.regex(/^(?=[a-zA-Zãõñáéíóúàèìòùç ]*$)(?!.*[<>'"/;`%])/)]),
    email: schema.string({}, [rules.trim(), rules.email()]),
    endereco: schema.string({}, [rules.trim(), rules.minLength(5), rules.regex(/^(?=[a-zA-Z0-9ãõñáéíóúàèìòùç!?., ]*$)(?!.*[<>'"/;`%])/)]),
    dataNascimento: schema.date({
      format: 'yyyy-MM-dd'
    }, [rules.before('today')]),
    password: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(8)]),
    sobrenome: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(1), rules.regex(/^(?=[a-zA-Zãõñáéíóúàèìòùç ]*$)(?!.*[<>'"/;`%])/)]),
    sexo: schema.enum(['masculino', 'feminino']),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'required': 'Preencha esse campo',
    'email.email': 'E-mail precisa estar no formato correto',
    'regex': "Sem caracteres especiais",
    "password.minLength": "Senhas precisam ter no mínimo 8 caracteres",
    "dataNascimento.before": "Não é possível escolher uma data futura",
    'date.format': 'Data de nascimento precisa estar no formato {{ options.format }}',
    'enum': 'Valor fora do padrão esperado'
  }
}
