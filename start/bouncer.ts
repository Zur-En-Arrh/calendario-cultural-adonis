import { Usuario } from 'App/Models/Usuario';
import Bouncer from "@ioc:Adonis/Addons/Bouncer";

export const {policies} = Bouncer.registerPolicies({
  EventoPolicy: () => import('App/Policies/EventoPolicy')
})
