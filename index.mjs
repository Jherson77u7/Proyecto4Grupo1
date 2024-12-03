//Codigo lambda 
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Inicializar cliente de DynamoDB
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
    console.log("Evento recibido:", JSON.stringify(event));

    // Verifica si es una invocación desde Alexa
    if (event.session?.application?.applicationId) {
        const intentName = event.request?.intent?.name;

        // Si el usuario invoca el skill sin un intent específico o con un intent desconocido
        if (!intentName || intentName === "AMAZON.HelpIntent") {
            return buildAlexaResponse(
                "¡Hola! Bienvenido al curso de sistemas. Tienes la opción de consultar el BPM actual. ¿Te gustaría saber tu frecuencia cardíaca?"
            );
        }

        switch (intentName) {
            case "GetCourseInfoIntent":
                return buildAlexaResponse(
                    "Bienvenido al curso de sistemas. Puedes consultar el BPM actual. ¿Te gustaría saber tu frecuencia cardíaca?"
                );

            case "GetHeartRateIntent":
                // Obtener BPM actual desde DynamoDB
                const bpm = await getBPMFromDynamoDB();
                if (bpm) {
                    return buildAlexaResponse(
                        `Tu frecuencia cardíaca actual es de ${bpm} latidos por minuto.`
                    );
                } else {
                    return buildAlexaResponse(
                        "Lo siento, no pude obtener tu frecuencia cardíaca en este momento."
                    );
                }

            default:
                return buildAlexaResponse("Lo siento, no entendí tu solicitud.");
        }
    }

    // Manejo de otros eventos (como guardar en DynamoDB)
    try {
        const command = new PutCommand({
            TableName: "sensor_data",
            Item: {
                timestamp: event.timestamp,  // Marca de tiempo
                thing_name: event.thing_name, // Nombre del dispositivo
                bpm: event.bpm,              // Latidos por minuto
            },
        });

        const response = await docClient.send(command);
        console.log("Datos almacenados en DynamoDB:", response);
        return { statusCode: 200, body: "Datos almacenados con éxito." };
    } catch (error) {
        console.error("Error al almacenar los datos en DynamoDB:", error);
        throw new Error("Error al almacenar los datos en DynamoDB");
    }
};

// Función para obtener el BPM más reciente desde DynamoDB
const getBPMFromDynamoDB = async () => {
    // Asegúrate de usar correctamente la clave primaria y la de ordenación
    const command = new GetCommand({
        TableName: "sensor_data",
        Key: {
            thing_name: "Esp32-sensor",  // La partition key (ajusta si es necesario)
            timestamp: "Último" // Aquí debes proporcionar el timestamp o la clave de ordenación si la usas. Ajusta según tu estructura
        },
    });

    try {
        const data = await docClient.send(command);
        if (data.Item && data.Item.bpm) {
            return data.Item.bpm; // Si el BPM está presente, devolverlo
        }
        return null; // Si no se encuentra el BPM
    } catch (error) {
        console.error("Error al obtener BPM desde DynamoDB:", error);
        return null; // En caso de error
    }
};

// Construir respuesta de Alexa
const buildAlexaResponse = (text) => {
    return {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: text,
            },
            shouldEndSession: false, // No cierra la sesión para seguir escuchando al usuario
        },
    };
};
