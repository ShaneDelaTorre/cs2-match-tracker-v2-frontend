set shell := ["zsh", "-cu"]

default:
    @just --list

dev:
    pnpm dev

build:
    pnpm build

lint:
    pnpm lint

typecheck:
    npx tsc --noEmit

install:
    pnpm install