
DROP TABLE IF EXISTS Ropita CASCADE;

CREATE TABLE Ropita
(
    id bigserial NOT NULL,
    marca text NOT NULL,
    precio text NOT NULL,
    tipo text,
    talla text,
    cantidad text,
    PRIMARY KEY(id)
);