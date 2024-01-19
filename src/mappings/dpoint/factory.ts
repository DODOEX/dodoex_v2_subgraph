import { CreateVault as CreateVaultEvent } from "../../types/dpoint/LockedTokenVaultFactory/LockedTokenVaultFactory";
import { LockedTokenVault as LockedTokenVaultTemplate } from "../../types/dpoint/templates";

export function handleCreateVault(event: CreateVaultEvent): void {
  LockedTokenVaultTemplate.create(event.params.vault);
}