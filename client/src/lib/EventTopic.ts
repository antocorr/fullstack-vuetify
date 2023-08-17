function generateUUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}
export class EventTopic {
    listeners: any = {};
    topics: any = {};
    name = null;
    $state = {};
    $obj:any = null;
    parent: any = null;
    propagate = false;
    id: string;
    constructor(parent: any = null, name: any = null){
        this.parent = parent
        this.id = generateUUID();
        this.name = name;
    }
    addEventListener(event : string, callback: Function, id = null) {
        if (this.listeners[event]) {
            this.listeners[event].push({ callback: callback, id: id });
            return this;
        }
        this.listeners[event] = [{ callback: callback, id: id }];
        return this;
    }
    removeEventListener(event : string, callback = null, id = null) {
        if (!this.listeners[event]) {
            return this;
        }
        let i = 0;
        for (var listener of this.listeners[event]) {
            if (id && listener.id == id) {
                this.listeners[event].splice(i, 1);
                return this;
            }
            if (callback && listener.callback == callback) {
                this.listeners[event].splice(i, 1);
                return this;
            }
            i += 1;
        }
        return this;
    }
    on(event: string, callback: Function, id = null) {
        this.addEventListener(event, callback, id);
        return this;
    }
    off(event: string, callback = null, id = null) {
        this.removeEventListener(event, callback, id);
        return this;
    }
    removeAllListeners() {
        this.listeners = {};
        return this;
    }
    
    emit(event : string) {
        if (this.listeners[event]) {
            var args = Array.prototype.slice.call(arguments);
            event = args.shift();
            for (var listener of this.listeners[event]) {
                const thisArg = this.$obj || this;
                listener["callback"].apply(thisArg, args);
            }
        }
        return this;
    }
    once(event: string){
        var args = Array.prototype.slice.call(arguments);
        this.emit.apply(this, args as any);
        this.removeEventListener(event);
        return this;
    }
    bubble(event: string) {
        this.emit(event);
        if(this.parent){
            if (this.parent.emit){
                var args = Array.prototype.slice.call(arguments);
                this.parent.bubble(this, args);
            }
        }
        return this;
    }
    topic(topic: string) {
        if (!this.topics[topic]) {
            this.topics[topic] = new EventTopic(this, topic);
        }
        return this.topics[topic];
    }
    remove(topic: string) {
        if (this.topics[topic]) {
            delete this.topics[topic];
        }
        return this;
    }
    copyFunctionalities(obj:any){
        const self:any = this;
        for(const fn of ['addEventListener', 'removeEventListener', 'on', 'off', 'emit']){
            obj[fn] = function () {
               const  args = Array.prototype.slice.call(arguments);
               self[fn].apply(self, args);
            }            
        }
    }
    setupApc(obj:any) {
        this.$obj = obj;
    }
    apc(func:string, args:any) {
        if (!this.$obj || !this.$obj[func]) {
            return;
        }
        args = Array.prototype.slice.call(arguments);
        func = args.shift();
        this.$obj[func].apply(this.$obj, args);
    }
    aset(key:string, val:any) {
        if (!this.$obj) {
            return;
        }
        this.$obj[key] = val;
    }
}