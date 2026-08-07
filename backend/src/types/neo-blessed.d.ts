// neo-blessed n'a pas ses propres types : il réexporte l'API de blessed (dont il est un fork),
// donc on réutilise @types/blessed en redirigeant le nom de module.
declare module "neo-blessed" {
	export * from "blessed";
}
