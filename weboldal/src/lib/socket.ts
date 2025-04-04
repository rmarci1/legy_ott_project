import { io, Socket } from 'socket.io-client';

/**
 * Socket.io kapcsolat létrehozása a backend szerverrel.
 *
 * Ez a kód egy Socket.io kapcsolatot hoz létre a szerverrel, amely a
 * `http://localhost:3000` címen található. A kapcsolat beállításai között szerepel
 * az automatikus újracsatlakozás, a csatlakozási próbálkozások száma és azok közötti
 * időbeli késleltetés is. A kapcsolat WebSocket alapú kommunikációt használ.
 *
 * A kapcsolat alapértelmezetten nem csatlakozik automatikusan (`autoConnect: false`),
 * így manuálisan kell kezdeményezni a csatlakozást a `socket.connect()` függvénnyel.
 *
 * @remarks
 * - **autoConnect**: Ha `false`, akkor a kapcsolat nem indul el automatikusan,
 *   és explicit módon kell csatlakoztatni a `connect()` függvénnyel.
 * - **transports**: A `['websocket']` érték azt jelzi, hogy a kapcsolat csak WebSocket-en keresztül történik.
 * - **reconnection**: Ha `true`, akkor a kapcsolat automatikusan próbálkozik újra csatlakozni, ha megszakad.
 * - **reconnectionAttempts**: Az újracsatlakozási próbálkozások maximális száma.
 * - **reconnectionDelay**: Az újracsatlakozási próbálkozások közötti időbeli késleltetés (milliszekundumban).
 */
const socket: Socket = io('http://localhost:3000', {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true, 
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;