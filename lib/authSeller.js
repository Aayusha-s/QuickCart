const authSeller = (sessionClaims) => {
    const role = sessionClaims?.public_metadata?.role

    return typeof role === 'string' && role.trim().toLowerCase() === 'seller'
}

export default authSeller;
