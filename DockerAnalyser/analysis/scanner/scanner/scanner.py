from .core.client_images_service import ClientImages
from .core.consumer_rabbit import ConsumerRabbit

# import the analysis function stotred into the deploy folder
from .deploy.analysis import analysis

import logging

"""
This module contains the *Scanner* microservice.
"""


class Scanner:

    def __init__(self, amqp_url='amqp://guest:guest@127.0.0.1:5672',
                 exchange=None, queue=None, route_key=None,
                 images_url="http://127.0.0.1:3000/api/images",
                 socket="unix://var/run/docker.sock"
                 ):

        self.logger = logging.getLogger(__class__.__name__)
        self.logger.info(__class__.__name__ + " logger  initialized")


        # pika.exceptions.AMQPConnectionError

        # rabbit consumer of RabbittMQ: receives the images name to scan,
        self.consumer = ConsumerRabbit(amqp_url=amqp_url, exchange=exchange,
                                       queue=queue, route_key=route_key,
                                       on_msg_callback=self.on_message_ctx)

        # client of Images Service: GET(); POST(); PUT(); DELETE() methods
        self.client_images = ClientImages(images_url=images_url)

    def run(self):
        """Start the scanner running the consumer client of the RabbitMQ server.
        """

        try:
            self.consumer.run()
        except KeyboardInterrupt:
            self.consumer.stop()

    def on_message_ctx(self, json_message):
        self.ctx = {'logger': self.logger,
                    'images': self.client_images}

        self.logger.info(
            "Received message from RabbitMQ. Calling analysis() of the lambda function")
        return analysis(json_message, self.ctx)
