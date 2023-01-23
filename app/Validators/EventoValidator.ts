import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EventoValidator {
  constructor(protected ctx: HttpContextContract) {

  }

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
    nome: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(5), rules.maxLength(155), rules.regex(/^(?=[a-zA-Z0-9ãõñáéíóúàèìòùç ]*$)(?!.*[<>'"/;`%])/)]),
    cidade: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(5), rules.maxLength(155), rules.regex(/^(?=[a-zA-Zãõñáéíóúàèìòùç ]*$)(?!.*[<>'"/;`%])/)]),
    frequencia: schema.enum(['quinzenal', 'mensal', 'anual']),
    tipoId: schema.number(),
    medica: schema.boolean(),
    estacionamento:schema.boolean(),
    seguranca:schema.boolean(),
    banheiro:schema.boolean(),
    deficiencia:schema.boolean(),
    caixa:schema.boolean(),
    foto: schema.file.optional({
      size: '5mb',
      extnames: ['png', 'jpg']
    })
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
    'regex': 'Sem caracteres especiais',
    'minLength': 'Nome precisa ter no mínimo 5 caracteres',
    'enum': 'Valor fora do padrão esperado',
    'maxLength': 'Tamanho máximo excedido do campo'
  }
}
