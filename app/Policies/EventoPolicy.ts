import { Usuario } from 'App/Models/Usuario';
import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";

export default class EventoPolicy extends BasePolicy {
  public async store(user: Usuario) {
    return user.admin == 1
  }

  public async edit(user: Usuario) {
    return user.admin == 1
  }

  public async destroy(user: Usuario) {
    return user.admin == 1
  }
}
