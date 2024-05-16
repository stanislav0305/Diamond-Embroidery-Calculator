export class ProcessingResult {
    public sended: number = 0
    public done: number = 0
    private _notProcessed: number = 0

    constructor(sended: number = 0) {
        this.sended = sended
    }
    
    public get notProcessed() {
        this._notProcessed = this.sended - this.done
        return this._notProcessed;
    }
}