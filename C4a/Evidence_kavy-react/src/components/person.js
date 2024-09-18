function Person({id, name}) {
    return (
        <>
         <input type="radio" id={id} name="user" value={id} required="" />
         <label for={id}>{name}</label>
        </>
    );
};

export default Person