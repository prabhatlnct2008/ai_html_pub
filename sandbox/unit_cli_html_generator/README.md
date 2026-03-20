## Unit CLI HTML Generator

Small Python 3.11 CLI for generating one homepage HTML file from business inputs.

This is intentionally isolated from the web app so you can test prompt and rendering quality
without the full Next.js/editor pipeline.

### What it does

1. Infers structured business context from name + description
2. Plans the site
3. Generates shared settings
4. Plans the homepage
5. Generates a single homepage `PageDocument`
6. Renders one standalone HTML file

It uses `gpt-4o-mini` through the OpenAI Chat Completions API and follows the same
planning stages as the main app, but stays CLI-based.

### Usage

```bash
python3.11 sandbox/unit_cli_html_generator/generate_html.py \
  --name "Sky Pet Grooming Services" \
  --description "Mobile dog and cat grooming in Bangalore for busy pet owners who want low-stress home appointments." \
  --output sandbox/unit_cli_html_generator/output/sky-pet-grooming.html
```

Optional:

```bash
  --location "Bangalore" \
  --audience "Busy urban pet owners"
```

### Environment

The script looks for `OPENAI_API_KEY` in:

- current environment
- `.env.local`
- `.env`

### Output

The script writes:

- one HTML file
- one JSON trace file with all intermediate artifacts next to the HTML output

### Notes

- This is a prototype path for new-project experimentation, not production code.
- It uses a standalone Python renderer, not the app renderer.
