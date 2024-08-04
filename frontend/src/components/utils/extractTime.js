function extractTime(createdAt) {
    const date = new Date(createdAt);

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    const time = `${hours}:${minutes}`;

    return time;
}

export default extractTime