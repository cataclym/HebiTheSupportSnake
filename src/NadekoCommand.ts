export default interface NadekoCommand {
    Aliases: string[],
    Description: string,
    Usage: string[],
    Submodule: string,
    Module: string,
    Options: string[] | null,
    Requirements: string[]
}
