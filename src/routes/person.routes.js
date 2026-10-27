import { Router } from 'express';
import { createPersonController } from '../controllers/person.controller.js';

    /**
     * @openapi
     * components:
     *   schemas:
     *     Person:
     *       type: object
     *       required:
     *         - person_id
     *         - names
     *         - lastname
     *         - active
     *         - created_at
     *         - updated_at
     *       properties:
     *         person_id:
     *           type: integer
     *           example: 1
     *         names:
     *           type: string
     *           maxLength: 50
     *           example: Ana
     *         lastname:
     *           type: string
     *           maxLength: 50
     *           example: Perez
     *         active:
     *           type: boolean
     *           example: true
     *         created_at:
     *           type: string
     *           format: date-time
     *           example: '2026-10-26T05:42:56.596Z'
     *         updated_at:
     *           type: string
     *           format: date-time
     *           example: '2026-10-26T19:42:55.625Z'
     */

    /**
     * @openapi
     * components:
     *   schemas:
     *     PersonInput:
     *       type: object
     *       additionalProperties: false
     *       required:
     *         - names
     *         - lastname
     *       properties:
     *         names:
     *           type: string
     *           minLength: 1
     *           maxLength: 50
     *           description: Nombre obligatorio. Se eliminan espacios en los extremos y se rechaza un texto compuesto solo por espacios.
     *           example: Ana
     *         lastname:
     *           type: string
     *           minLength: 1
     *           maxLength: 50
     *           description: Apellido obligatorio. Se eliminan espacios en los extremos y se rechaza un texto compuesto solo por espacios.
     *           example: Perez
     */

    /**
     * @openapi
     * components:
     *   schemas:
     *     PersonPatchInput:
     *       type: object
     *       additionalProperties: false
     *       minProperties: 1
     *       properties:
     *         names:
     *           type: string
     *           minLength: 1
     *           maxLength: 50
     *           description: Nombre nuevo. Se eliminan espacios en los extremos y se rechaza un texto compuesto solo por espacios.
     *           example: Ana
     *         lastname:
     *           type: string
     *           minLength: 1
     *           maxLength: 50
     *           description: Apellido nuevo. Se eliminan espacios en los extremos y se rechaza un texto compuesto solo por espacios.
     *           example: Perez
     *       example:
     *         names: Ana
     */

const createPersonRouter = (Person) => {
    const router = Router();
    const {
        getPersons,
        createPerson,
        getPersonById,
        updatePerson,
        patchPerson,
        deletePerson,
    } = createPersonController(Person);

    /**
     * @openapi
     * /person:
     *   get:
     *     summary: Obtener personas activas
     *     description: Devuelve las personas activas. Si no hay ninguna, devuelve una lista vacía.
     *     tags:
     *       - Personas
     *     responses:
     *       '200':
     *         description: Consulta exitosa
     *         content:
     *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                 $ref: '#/components/schemas/Person'
     *             example: []
     *       '500':
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Error interno del servidor
     */

    router.get('/', getPersons);

    /**
     * @openapi
     * /person:
     *   post:
     *     summary: Crear una persona
     *     description: Crea una persona activa. Solo acepta names y lastname.
     *     tags:
     *       - Personas
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PersonInput'
     *     responses:
     *       '201':
     *         description: Persona creada correctamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Person'
     *       '400':
     *         description: Datos de entrada inválidos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: names y lastname son obligatorios y deben ser texto
     *       '500':
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Error interno del servidor
     */

    router.post('/', createPerson);

    /**
     * @openapi
     * /person/{id}:
     *   get:
     *     summary: Obtener una persona por ID
     *     description: Devuelve una persona activa. Si no existe o está inactiva, responde 404.
     *     tags:
     *       - Personas
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Identificador de la persona
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 2147483647
     *         example: 1
     *     responses:
     *       '200':
     *         description: Persona encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Person'
     *       '400':
     *         description: Identificador inválido
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: El ID debe ser un número entero positivo
     *       '404':
     *         description: Persona inexistente o inactiva
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Persona no encontrada
     *       '500':
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Error interno del servidor
     */

    router.get('/:id', getPersonById);

    /**
     * @openapi
     * /person/{id}:
     *   put:
     *     summary: Actualizar nombre y apellido de una persona
     *     description: Requiere names y lastname. Solo actualiza personas activas y no permite modificar active.
     *     tags:
     *       - Personas
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Identificador de la persona
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 2147483647
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PersonInput'
     *           example:
     *             names: Ana Maria
     *             lastname: Perez
     *     responses:
     *       '200':
     *         description: Persona actualizada correctamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Person'
     *       '400':
     *         description: ID o datos de entrada inválidos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: names y lastname son obligatorios y deben ser texto
     *       '404':
     *         description: Persona inexistente o inactiva
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Persona no encontrada
     *       '500':
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Error interno del servidor
     */

    router.put('/:id', updatePerson);

    /**
     * @openapi
     * /person/{id}:
     *   patch:
     *     summary: Actualizar parcialmente una persona
     *     description: Modifica names, lastname o ambos. Conserva los campos no enviados. Solo actualiza personas activas y no permite modificar active.
     *     tags:
     *       - Personas
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Identificador de la persona
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 2147483647
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PersonPatchInput'
     *           example:
     *             names: Ana
     *     responses:
     *       '200':
     *         description: Persona actualizada correctamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Person'
     *       '400':
     *         description: ID o datos inválidos, cuerpo vacío o campos no permitidos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Debes enviar al menos names o lastname
     *       '404':
     *         description: Persona inexistente o inactiva
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Persona no encontrada
     *       '500':
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Error interno del servidor
     */

    router.patch('/:id', patchPerson);

    /**
     * @openapi
     * /person/{id}:
     *   delete:
     *     summary: Desactivar una persona
     *     description: Establece active en false sin eliminar el registro. Si no existe o ya está inactivo, responde 404.
     *     tags:
     *       - Personas
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Identificador de la persona
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 2147483647
     *         example: 1
     *     responses:
     *       '204':
     *         description: Persona desactivada correctamente. Respuesta sin contenido.
     *       '400':
     *         description: Identificador inválido
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: El ID debe ser un número entero positivo
     *       '404':
     *         description: Persona inexistente o inactiva
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Persona no encontrada
     *       '500':
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Error interno del servidor
     */

    router.delete('/:id', deletePerson);

    return router;
};

export { createPersonRouter };