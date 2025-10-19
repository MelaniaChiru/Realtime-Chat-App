import websockets.asyncio.server as wss
import asyncio
import logging
import json

logging.basicConfig(level=logging.DEBUG)

class EchoBroadcaster:
    def __init__(self):
        self.server = None
        self.history = []
        # Looks like this: {'channel_name': {'history': [], 'clients': set()}}
        self.channels = {}

        # Looks like this: self.clients = {}  # Stores {websocket_obj: 'channel_name'}
        self.clients = {}

    async def mapClientToChannel(self, websocket, channel_name):
        ''' add client to a channel'''
        # Add channel to channels array if it's new
        if channel_name not in self.channels:
            self.channels[channel_name] = {'history': [], 'clients': set()}
            logging.info(f'created new channel({channel_name})')

        # add current websocket to channel client set
        self.channels[channel_name]['clients'].add(websocket)

        # map websocket to channel name
        self.clients[websocket] = channel_name
        logging.info(f'Client added to channel({channel_name})')
    
    async def send_message_history(self, websocket, channel_name):
        ''' Send message history of given channel'''
        history = self.channels[channel_name]['history']
        for message in history:
            await websocket.send(message)

    async def process_message(self, websocket, message):
        try:
            data = json.loads(message)
            channel_name = self.clients.get(websocket)
            desired_channel = data.get('channel')

            # If client is not mapped or message is for different channel
            if not channel_name or desired_channel != channel_name:
                await self.mapClientToChannel(websocket, desired_channel)

                # send history
                await self.send_message_history(websocket, desired_channel)
                return

            if channel_name:
                channel_data = self.channels[channel_name]

                # Store message
                channel_data['history'].append(message)

                # Broadcast message ONLY to clients of given message channel
                clients_in_channel = channel_data['clients']
                wss.broadcast(clients_in_channel, message)
        except Exception as e:
            logging.error(e)
    
    async def handle_connection(self, websocket):
        ''' mnagage connection of a client'''
        try:
            async for message in websocket:
                await self.process_message(websocket, message)

        except Exception as e:
            logging.error(e)
    
            
    async def serve(self):
        self.server = await wss.serve(self.handle_connection, "localhost", 8000)
        await self.server.serve_forever()

broadcaster = EchoBroadcaster()
asyncio.run(broadcaster.serve())