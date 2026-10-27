const createPersonController = (Person) => {
    const getPersons = async (req, res) => {
        try {
            const persons = await Person.findAll({
                where: {
                    active: true,
                },
            });

            return res.status(200).json(persons);
        } catch (error) {
            console.error('Error al consultar personas:', error.message);

            return res.status(500).json({
                message: 'Error interno del servidor',
            });
        }
    };

    const createPerson = async (req, res) => {
        const body = req.body;

            if (!body || typeof body !== 'object' || Array.isArray(body)) {
                return res.status(400).json({
                    message: 'Debes enviar un objeto JSON',
                });
            }

            const allowedFields = ['names', 'lastname'];

            const hasUnknownFields = Object.keys(body).some(
                (field) => !allowedFields.includes(field)
            );

            if (hasUnknownFields) {
                return res.status(400).json({
                    message: 'Solo se permiten los campos names y lastname',
                });
            }

            const { names, lastname } = body;

            if (typeof names !== 'string' || typeof lastname !== 'string') {
                return res.status(400).json({
                    message: 'names y lastname son obligatorios y deben ser texto',
                });
            }

            const cleanNames = names.trim();
            const cleanLastname = lastname.trim();

            if (
                cleanNames.length === 0 ||
                cleanNames.length > 50 ||
                cleanLastname.length === 0 ||
                cleanLastname.length > 50
            ) {
                return res.status(400).json({
                    message: 'names y lastname deben tener entre 1 y 50 caracteres',
                });
            }


        // Después validaremos los campos permitidos y la longitud.
        // Finalmente guardaremos la persona.
            try {
                const person = await Person.create({
                    names: cleanNames,
                    lastname: cleanLastname,
                    active: true,
                });

                return res.status(201).json(person);
            } catch (error) {
                console.error('Error al crear persona:', error.message);

                return res.status(500).json({
                    message: 'Error interno del servidor',
                });
            }
    };

    const getPersonById = async (req, res) => {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: 'El ID debe ser un número entero positivo',
            });
        }

        const personId = Number(id);

        if (!Number.isSafeInteger(personId) || personId > 2147483647) {
            return res.status(400).json({
                message: 'El ID está fuera del rango permitido',
            });
    }

    // Aquí consultaremos la persona.
    try {
        const person = await Person.findOne({
                where: {
                    person_id: personId,
                    active: true,
                },
            });

            if (!person) {
                return res.status(404).json({
                    message: 'Persona no encontrada',
                });
            }

            return res.status(200).json(person);
            } catch (error) {
                console.error('Error al consultar persona:', error.message);

                return res.status(500).json({
                    message: 'Error interno del servidor',
                });
        }

    };

    const updatePerson = async (req, res) => {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: 'El ID debe ser un número entero positivo',
            });
        }

        const personId = Number(id);

        if (!Number.isSafeInteger(personId) || personId > 2147483647) {
            return res.status(400).json({
                message: 'El ID está fuera del rango permitido',
            });
        }

        // Aquí validaremos el nombre y el apellido nuevos.
        // Después actualizaremos la persona activa.
        const body = req.body;

        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return res.status(400).json({
                message: 'Debes enviar un objeto JSON',
            });
        }

        const allowedFields = ['names', 'lastname'];

        const hasUnknownFields = Object.keys(body).some(
            (field) => !allowedFields.includes(field)
        );

        if (hasUnknownFields) {
            return res.status(400).json({
                message: 'Solo se permiten los campos names y lastname',
            });
        }

        const { names, lastname } = body;

        if (typeof names !== 'string' || typeof lastname !== 'string') {
            return res.status(400).json({
                message: 'names y lastname son obligatorios y deben ser texto',
            });
        }


        const cleanNames = names.trim();
        const cleanLastname = lastname.trim();

        if (
                cleanNames.length === 0 ||
                cleanNames.length > 50 ||
                cleanLastname.length === 0 ||
                cleanLastname.length > 50
            ) {
                return res.status(400).json({
                    message: 'names y lastname deben tener entre 1 y 50 caracteres',
                });
        }

        try {
            const [updatedCount, updatedPersons] = await Person.update(
                {
                    names: cleanNames,
                    lastname: cleanLastname,
                },
                {
                    where: {
                        person_id: personId,
                        active: true,
                    },
                    returning: true,
                }
            );

            if (updatedCount === 0) {
                return res.status(404).json({
                    message: 'Persona no encontrada',
                });
            }

                return res.status(200).json(updatedPersons[0]);
            } catch (error) {
                console.error('Error al actualizar persona:', error.message);

                return res.status(500).json({
                    message: 'Error interno del servidor',
                });
        }

    };

    const patchPerson = async (req, res) => {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: 'El ID debe ser un número entero positivo',
            });
        }

        const personId = Number(id);

        if (!Number.isSafeInteger(personId) || personId > 2147483647) {
            return res.status(400).json({
                message: 'El ID está fuera del rango permitido',
            });
        }

        // Aquí validaremos los campos que el cliente quiera modificar.
        const body = req.body;

        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return res.status(400).json({
                message: 'Debes enviar un objeto JSON',
            });
        }

        const allowedFields = ['names', 'lastname'];
        const receivedFields = Object.keys(body);

        if (receivedFields.length === 0) {
            return res.status(400).json({
                message: 'Debes enviar al menos names o lastname',
            });
        }

        const hasUnknownFields = receivedFields.some(
            (field) => !allowedFields.includes(field)
        );

        if (hasUnknownFields) {
            return res.status(400).json({
                message: 'Solo se permiten los campos names y lastname',
            });
        }

        const changes = {};

        for (const field of receivedFields) {
            const value = body[field];

            if (typeof value !== 'string') {
                return res.status(400).json({
                    message: `${field} debe ser texto`,
                });
            }

            const cleanValue = value.trim();

            if (cleanValue.length === 0 || cleanValue.length > 50) {
                return res.status(400).json({
                    message: `${field} debe tener entre 1 y 50 caracteres`,
                });
            }

            changes[field] = cleanValue;
        }

        try {
            const [updatedCount, updatedPersons] = await Person.update(
                changes,
                {
                    where: {
                        person_id: personId,
                        active: true,
                    },
                    returning: true,
                }
            );

                if (updatedCount === 0) {
                    return res.status(404).json({
                        message: 'Persona no encontrada',
                    });
                }

                return res.status(200).json(updatedPersons[0]);
            } catch (error) {
                console.error('Error al actualizar parcialmente:', error.message);

                return res.status(500).json({
                    message: 'Error interno del servidor',
                });
        }

    };

    const deletePerson = async (req, res) => {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: 'El ID debe ser un número entero positivo',
            });
        }

        const personId = Number(id);

        if (!Number.isSafeInteger(personId) || personId > 2147483647) {
            return res.status(400).json({
                message: 'El ID está fuera del rango permitido',
            });
        }

        // Aquí desactivaremos la persona.
        try {
            const [updatedCount] = await Person.update(
                {
                    active: false,
                },
                {
                    where: {
                        person_id: personId,
                        active: true,
                    },
                }
            );

            if (updatedCount === 0) {
                return res.status(404).json({
                    message: 'Persona no encontrada',
                });
            }

            return res.status(204).end();
        } catch (error) {
            console.error('Error al desactivar persona:', error.message);

            return res.status(500).json({
                message: 'Error interno del servidor',
            });
        }
        
    };

        
    return {
            getPersons,
            createPerson,
            getPersonById,
            updatePerson,
            patchPerson,
            deletePerson,
        };
};

export { createPersonController };