export const ass = <T>( value: T | undefined | null ) => {
  if( value === undefined ) throw Error( 'Unexpected undefined' )
  if( value === null ) throw Error( 'Unexpected null' )

  return value
}
