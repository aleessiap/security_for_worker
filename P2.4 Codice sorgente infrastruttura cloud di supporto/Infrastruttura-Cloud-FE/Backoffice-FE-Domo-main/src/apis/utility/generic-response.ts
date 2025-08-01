import { IError, IPaginateMeta } from '@visioscientiae/backoffice-packages-domo';

export class GenericResponse<T> {
	data: T | null
	err: IError | null
	
	constructor(data = null, err = null){
		this.data = data
		this.err = err
	}
}


export class GenericPaginatedResponse<T> {
	data: T | null
	meta: IPaginateMeta | null // TODO Interface
	err: IError | null
	
	constructor(data = null, err = null, meta = null){
		this.data = data
		this.err = err
		this.meta = meta
	}
}
