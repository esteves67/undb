import { Command, type CommandProps } from "@undb/domain"
import { enableShareDTO, type IShareTarget } from "@undb/share"
import { z } from "@undb/zod"

export const enableShareCommand = enableShareDTO

export type IEnableShareCommand = z.infer<typeof enableShareCommand>

export class EnableShareCommand extends Command implements IEnableShareCommand {
  public readonly target: IShareTarget
  public readonly enabled: boolean

  constructor(props: CommandProps<IEnableShareCommand>) {
    super(props)
    this.enabled = props.enabled
    this.target = props.target
  }
}
