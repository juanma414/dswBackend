//definimos todos los elementos comunes y los extendemos a las subclases
import { PrimaryKey } from "@mikro-orm/core"

export abstract class BaseEntity{
    
    @PrimaryKey() 
    id?: number

    /*
    @Property({ type: DateTimeType }) 
    createDate = new Date()

    @Property({ type: DateTimeType, onUpdate: ()=> new Date() }) 
    updateAt = new Date()
    */
}