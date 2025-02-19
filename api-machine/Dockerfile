FROM continuumio/miniconda3

WORKDIR /app

# Create the environment:
COPY machine_api.yml .
RUN conda env create -f machine_api.yml

# Make RUN commands use the new environment:
SHELL ["conda", "run", "-n", "machine-api", "/bin/bash", "-c"]

EXPOSE 5000

# The code to run when container is started:
COPY server.py .
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "machine-api", "python"]

CMD [ "server.py" ]

